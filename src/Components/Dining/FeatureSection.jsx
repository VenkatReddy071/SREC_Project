export const FeatureSection = ({ title, content, imageUrl, imageAlt, imageRight = false,button }) => (
  <section className="py-12  my-12 max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-['Inter']">{title}</h2>
    <div className={`flex flex-col md:flex-row gap-8 items-center ${imageRight ? 'md:flex-row-reverse' : ''}`}>
      <div className="w-full md:w-1/2">
        <p className="text-lg text-gray-700 leading-relaxed font-['Inter']">{content}</p>
        
      </div>

      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="rounded-lg shadow-xl max-w-full h-auto object-cover"
          onError={(e) => e.target.src = "https://placehold.co/600x400/E0E0E0/333333?text=Feature+Image"}
        />
      </div>
    </div>
  </section>
);