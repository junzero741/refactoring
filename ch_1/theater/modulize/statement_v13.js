// 데이터 처리 관련 코드들을 별도 모듈로 분리, html 버전으로 변경
import createStatementData from "./createStatementData.js";
import invoices from "../invoices.js";
import plays from "../plays.js";

function statement(invoice, plays) {
	return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
	let result = `청구 내역 (고객명: ${data.customer})\n`;
	for (let perf of data.performances) {
		result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
	}
	result += `총액: ${usd(data.totalAmount)}\n`;
	result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
	return result;
}

function htmlStatement(invoice, plays) {
	return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
	let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
	result += "<table>\n";
	result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
	for (let perf of data.performances) {
		result += ` <tr><td>${perf.play.name}</td>  <td>(${perf.audience}석)</td>`;
		result += `<td>${usd(perf.amount)}</td></tr>\n`;
	}
	result += "</table>\n";
	result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
	result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;
	return result;
}

function usd(aNumber) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(aNumber / 100);
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
