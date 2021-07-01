// 변수 인라인

const invoices = require("./invoices");
const plays = require("./plays");

function statement(invoice, plays) {
	let totalAmount = 0;
	let volumeCredits = 0;
	let result = `청구 내역 (고객명: ${invoice.customer})\n`;
	const format = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format;

	for (let perf of invoice.performances) {
		// const play = playFor(perf)    <- play 지역변수를 없애고, play 변수 자리에 playFor(perf) 를 넣는다.
		// let thisAmount = amountFor(perf); <- thisAmount 지역변수를 없애고, thisAmount 자리에 amountFor(perf) 를 넣는다.

		function playFor(aPerformance) {
			return plays[aPerformance.playID];
		}

		function amountFor(aPerformance) {
			let result = 0;

			switch (
				playFor(perf).type // 여기
			) {
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
					throw new Error(`알 수 없는 장르: ${playFor(perf).type}`); // 여기
			}
			return result;
		}

		volumeCredits += Math.max(perf.audience - 30, 0);

		if ("comedy" === playFor(perf).type)
			// 여기
			volumeCredits += Math.floor(perf.audience / 5);

		result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
			// 여기
			perf.audience
		}석)\n`;
		totalAmount += amountFor(perf);
	}

	result += `총액: ${format(totalAmount / 100)}\n`;
	result += `적립 포인트: ${volumeCredits}점\n`;
	return result;
}

// 실행

invoices.forEach(invoice => {
	console.log(statement(invoice, plays));
});
