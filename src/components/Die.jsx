export default function Die({ value, onRoll, disabled }) {
	return (
		<button className="die" onClick={onRoll} disabled={disabled}>
			<span className="pips">{value ?? "-"}</span>
			<span className="label">{disabled ? "(start first)" : "roll"}</span>
		</button>
	);
}
