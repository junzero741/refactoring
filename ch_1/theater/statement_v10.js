// 중간 데이터 구조 활용

const invoices = require("./invoices");
const plays = require("./plays");

function statement(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return renderPlainText(statementData, plays);

	function enrichPerformance(aPerformance) {
		const result = Object.assign({}, aPerformance); // 얕은 복사 수행
		result.play = playFor(result);
		result.amount = amountFor(result);
		result.volumeCredits = volumeCreditsFor(result);
		return result;
	}

	function totalVolumeCredits(data) {
		// renderPlainText의 중첩함수였던 totalVolumeCredits()를 statement()로 옮김
		let result = 0;
		for (let perf of data.performances) {
			result += perf.volumeCredits;
		}
		return result;
	}

	function totalAmount(data) {
		// renderPlainText의 중첩함수였던 totalAmount()를 statement()로 옮김
		let result = 0;
		for (let perf of data.performances) {
			result += perf.amount;
		}
		return result;
	}

	function volumeCreditsFor(aPerformance) {
		// renderPlainText의 중첩함수였던 volumeCreditesFor()를 statement()로 옮김
		let result = 0;
		result += Math.max(aPerformance.audience - 30, 0);
		if ("comedy" === aPerformance.play.type)
			result += Math.floor(aPerformance.audience / 5);
		return result;
	}

	function amountFor(aPerformance) {
		// renderPlainText의 중첩함수였던 amountFor()를 statement()로 옮김
		let result = 0;
		switch (aPerformance.play.type) {
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
				throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
		}
		return result;
	}

	function playFor(aPerformance) {
		// renderPlainText의 중첩함수였던 playFor()를 statement()로 옮김
		return plays[aPerformance.playID];
	}
}

function renderPlainText(data) {
	let result = `청구 내역 (고객명: ${data.customer})\n`;
	for (let perf of data.performances) {
		result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
	}
	result += `총액: ${usd(data.totalAmount)}\n`;
	result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
	return result;

	function usd(aNumber) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(aNumber / 100);
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
