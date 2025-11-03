export default function HomePage() {
  return (
    <section className="text-center py-20 bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Teera Travel</h1>
      <p className="text-gray-600 mb-8">Discover amazing snorkeling trips around Ko Talu!</p>
      <a href="/tours" className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
        View Tours
      </a>
    </section>
  );
}