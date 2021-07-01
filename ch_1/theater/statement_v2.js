// 변수명 바꾸기

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
		const play = playFor(perf); // 우변을 함수로 추출
		let thisAmount = amountFor(perf, play);

		function playFor(aPerformance) {
			return plays[aPerformance.playID];
		}

		function amountFor(aPerformance, play) {
			// 명확한 이름으로 변경 ( 매개변수 이름에 접두어로 타입 이름을 적되, 매개변수의 역할이 뚜렷하지 않으면 부정관사(a/an)을 붙인다. )
			let result = 0; // 명확한 이름으로 변경

			switch (play.type) {
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
					throw new Error(`알 수 없는 장르: ${play.type}`);
			}
			return result; // 함수의 반환값에 result라는 이름을 써서 변수의 역할을 쉽게 알 수 있다.
		}

		volumeCredits += Math.max(perf.audience - 30, 0);

		if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

		result += ` ${play.name}: ${format(thisAmount / 100)} (${
			perf.audience
		}석)\n`;
		totalAmount += thisAmount;
	}

	result += `총액: ${format(totalAmount / 100)}\n`;
	result += `적립 포인트: ${volumeCredits}점\n`;
	return result;
}

// 실행

invoices.forEach(invoice => {
	console.log(statement(invoice, plays));
});
