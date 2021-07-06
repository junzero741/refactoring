// statement() 에 필요한 데이터 처리에 해당하는 코드를 별도 함수로 빼낸다

const invoices = require("./invoices");
const plays = require("./plays");

function createStatementData(invoice, plays) {
	// 데이터 처리 로직을 별도 함수로 분리
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return statementData;
}

function statement(invoice, plays) {
	return renderPlainText(createStatementData(invoice, plays));
}

function enrichPerformance(aPerformance) {
	const result = Object.assign({}, aPerformance);
	result.play = playFor(result);
	result.amount = amountFor(result);
	result.volumeCredits = volumeCreditsFor(result);
	return result;
}

function totalVolumeCredits(data) {
	return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

function totalAmount(data) {
	return data.performances.reduce((total, p) => total + p.amount, 0);
}

function volumeCreditsFor(aPerformance) {
	let result = 0;
	result += Math.max(aPerformance.audience - 30, 0);
	if ("comedy" === aPerformance.play.type)
		result += Math.floor(aPerformance.audience / 5);
	return result;
}

function amountFor(aPerformance) {
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
	return plays[aPerformance.playID];
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
