import React, { useState } from "react";

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null); // State untuk item FAQ yang aktif
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian

  const faqData = [
    {
      question: "Bagaimana cara memulai usaha peternakan ayam?",
      answer:
        "Untuk memulai usaha peternakan ayam, Anda perlu mempersiapkan lokasi kandang yang sesuai, memilih bibit ayam berkualitas, dan memastikan pakan yang bergizi.",
    },
    {
      question: "Apakah AyamTernakKu menyediakan pelatihan?",
      answer:
        "Ya, AyamTernakKu menyediakan pelatihan dan konsultasi untuk membantu peternak pemula meningkatkan keterampilan dan pengetahuan.",
    },
    {
      question: "Bagaimana cara menjaga kesehatan ayam?",
      answer:
        "Pastikan ayam mendapatkan vaksinasi yang tepat waktu, menjaga kebersihan kandang, dan menyediakan pakan yang kaya nutrisi.",
    },
    {
      question: "Apakah AyamTernakKu mendukung pemasaran produk ayam?",
      answer:
        "Kami menyediakan platform untuk memasarkan produk ayam Anda ke pasar lokal maupun nasional.",
    },
    {
      question: "Jenis ayam apa yang cocok untuk peternakan skala kecil?",
      answer:
        "Untuk peternakan skala kecil, ayam kampung atau ayam pedaging seperti broiler adalah pilihan yang baik karena permintaan pasar yang tinggi.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle FAQ
  };

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="faq-section">
      <h2>Pertanyaan Umum</h2>
      <p>
        Temukan jawaban untuk pertanyaan umum tentang AyamTernakKu di bawah ini.
      </p>

      <div className="faq-search">
        <input
          type="text"
          id="faq-search"
          placeholder="Cari pertanyaan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="faq-items">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <h4 className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question}
              <button className="faq-toggle">
                {activeIndex === index ? "×" : "+"}
              </button>
            </h4>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Faq;
