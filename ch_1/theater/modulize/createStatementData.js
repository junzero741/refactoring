class PerformanceCalculator {
	// 최상위에 계산기 클래스 생성
	constructor(aPerformance, aPlay) {
		this.performance = aPerformance;
		this.play = aPlay;
	}

	get amount() {
		// amountFor() 함수의 코드를 계산기 클래스로 복사
		let result = 0;
		switch (
			this.play.type // amountFor() 함수가 매개변수로 받던 정보를 계산기 필드에서 바로 얻음
		) {
			case "tragedy":
				result = 40000;
				if (this.performance.audience > 30) {
					result += 1000 * (this.performance.audience - 30);
				}
				break;
			case "comedy":
				result = 30000;
				if (this.performance.audience > 20) {
					result += 10000 + 500 * (this.performance.audience - 20);
				}
				result += 300 * this.performance.audience;
				break;
			default:
				throw new Error(`알 수 없는 장르: ${this.play.type}`);
		}
		return result;
	}

	get volumeCredits() {
		// volumeCreditsFor() 함수의 코드를 계산기 클래스로 복사
		let result = 0;
		result += Math.max(this.performance.audience - 30, 0); // volumeCreditsFor() 함수가 매개변수로 받던 정보를 계산기 필드에서 바로 얻음
		if ("comedy" === this.play.type)
			result += Math.floor(this.performance.audience / 5);
		return result;
	}
}

export default function createStatementData(invoice, plays) {
	const result = {};
	result.customer = invoice.customer;
	result.performances = invoice.performances.map(enrichPerformance);
	result.totalAmount = totalAmount(result);
	result.totalVolumeCredits = totalVolumeCredits(result);
	return result;

	function enrichPerformance(aPerformance) {
		const calculator = new PerformanceCalculator(
			aPerformance,
			playFor(aPerformance)
		); // 공연료 계산기 생성
		const result = Object.assign({}, aPerformance);
		result.play = calculator.play;
		result.amount = calculator.amount;
		result.volumeCredits = calculator.volumeCredits;
		return result;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}

	function totalAmount(data) {
		return data.performances.reduce((total, p) => total + p.amount, 0);
	}

	function totalVolumeCredits(data) {
		return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
	}
}
