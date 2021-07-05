// 계산 단계와 포맷팅 단계 분리하기

const invoices = require("./invoices");
const plays = require("./plays");

function statement(invoice, plays) {
	const statementData = {}; // 중간 데이터 구조를 인수로 전달
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances;
	return renderPlainText(statementData, plays);
}

function renderPlainText(data, plays) {
	// 중간 데이터 구조를 인수로 전달
	let result = `청구 내역 (고객명: ${data.customer})\n`; // 고객 데이터를 중간 데이터로부터 얻음
	for (let perf of data.performances) {
		result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
			perf.audience
		}석)\n`;
	}
	result += `총액: ${usd(totalAmount())}\n`;
	result += `적립 포인트: ${totalVolumeCredits()}점\n`;
	return result;

	function usd(aNumber) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(aNumber / 100);
	}

	function totalVolumeCredits() {
		let result = 0;
		for (let perf of data.performances) {
			result += volumeCreditsFor(perf);
		}
		return result;
	}

	function totalAmount() {
		let result = 0;
		for (let perf of data.performances) {
			result += amountFor(perf);
		}
		return result;
	}

	function volumeCreditsFor(aPerformance) {
		let result = 0;
		result += Math.max(aPerformance.audience - 30, 0);
		if ("comedy" === playFor(aPerformance).type)
			result += Math.floor(aPerformance.audience / 5);
		return result;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}

	function amountFor(aPerformance) {
		let result = 0;
		switch (playFor(aPerformance).type) {
			case "tragedy":
				result = 40000;
				if (aPerformance.audience > 30) {
					result += 1000 * (aPerformance.audience - 30);
				}
				break;
			case "comedy":
				result = 30000;
				if (aPerformance.audience > 20) {
					result += 10000 + 500 * (aPerformance.audience - 20);
				}
				result += 300 * aPerformance.audience;
				break;
			default:
				throw new Error(`알 수 없는 장르: ${playFor(perf).type}`);
		}
		return result;
	}
}

// 실행
invoices.forEach(invoice => {
	console.log(statement(invoice, plays));
});

const expectedResult = `
청구 내역 (고객명: BigCo)
Hamlet: $650.00 (55석)
As You Like It: $580.00 (35석)
Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점`;
