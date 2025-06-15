export const ServiceOverview = () => (
  <section className="py-12 bg-gray-100 rounded-xl mt-8 mb-12 text-center max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-gray-800 mb-6 font-['Inter']">Why Choose Our Food Delivery?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex flex-col items-center">
        <svg className="w-16 h-16 text-orange-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.333 0 2.667 0 4 0 0 1.333 0 2.667 0 4 1.333 0 2.667 0 4 0 0 1.333 0 2.667 0 4-1.333 0-2.667 0-4 0 0 1.333 0 2.667 0 4-1.333 0-2.667 0-4 0 0-1.333 0-2.667 0-4-1.333 0-2.667 0-4 0 0-1.333 0-2.667 0-4-1.333 0-2.667 0-4 0 0-1.333 0-2.667 0-4z"></path></svg>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-['Inter']">Vast Selection</h3>
        <p className="text-gray-600 font-['Inter']">Access thousands of restaurants and cuisines at your fingertips.</p>
      </div>
      <div className="flex flex-col items-center">
        <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-['Inter']">Fast Delivery</h3>
        <p className="text-gray-600 font-['Inter']">Get your food quickly and fresh, right to your door.</p>
      </div>
      <div className="flex flex-col items-center">
        <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-['Inter']">Quality Assured</h3>
        <p className="text-gray-600 font-['Inter']">Partnering only with top-rated and hygienic establishments.</p>
      </div>
    </div>
  </section>
);