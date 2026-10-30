export default function Home() {
  return (
    <>
      <h2>End to end</h2>
      <p>
        This React page does not hold the campus list. Express on port 3000 reads and writes
        MongoDB. Refresh after you report an issue — the card should still be there.
      </p>
      <ol className="steps">
        <li>Home — this screen (no database call yet).</li>
        <li>Issues — GET the list, PUT a location, DELETE a card.</li>
        <li>Report — POST a new issue, then open Issues.</li>
      </ol>
    </>
  );
}
