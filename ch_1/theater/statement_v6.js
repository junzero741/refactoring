// 반복문 쪼개기

const invoices = require("./invoices");
const plays = require("./plays");

function statement(invoice, plays) {
	let totalAmount = 0;
	let result = `청구 내역 (고객명: ${invoice.customer})\n`;

	function usd(aNumber) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(aNumber / 100);
	}

	for (let perf of invoice.performances) {
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

			switch (playFor(perf).type) {
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

		result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
			perf.audience
		}석)\n`;
		totalAmount += amountFor(perf);
	}

	let volumeCredits = 0; // 변수 선언(초기화) 를 반복문 앞으로 이동
	for (let perf of invoice.performances) {
		volumeCredits += volumeCreditsFor(perf); // 값 누적 로직을 별도 for문으로 분리
	}

	result += `총액: ${usd(totalAmount)}\n`;
	result += `적립 포인트: ${volumeCredits}점\n`;
	return result;
}

// 실행

invoices.forEach(invoice => {
	console.log(statement(invoice, plays));
});
