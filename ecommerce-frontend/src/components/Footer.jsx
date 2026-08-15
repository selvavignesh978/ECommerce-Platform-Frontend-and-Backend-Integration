const Footer = () => {
  return (
    <footer className="bg-ink text-paper/70 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-display text-xl text-paper mb-2">Market & Co.</h3>
          <p>delivers premium lifestyle, tech, and home essentials designed for effortless everyday living. Shop durable, high-utility goods backed by seamless shopping and reliable delivery.</p>
        </div>
        <div>
          <h4 className="text-paper mb-2 font-medium">Quick Links</h4>
          <ul className="space-y-1">
            <li>Shop</li>
            <li>Contact</li>
            <li>Orders</li>
          </ul>
        </div>
        <div>
          <h4 className="text-paper mb-2 font-medium">Stack</h4>
          <ul className="space-y-1">
            <li>React</li>
            <li>Redux Toolkit</li>
            <li>Node.js </li>
            <li>Express</li>
            <li>MongoDB</li>
            <li>JWT</li></ul>
          {/* <p>React · Redux Toolkit · Node.js · Express · MongoDB · JWT</p> */}
        </div>
      </div>
      <div className="border-t border-paper/10 text-center text-xs py-4">
        © {new Date().getFullYear()} Market & Co. — Built for educational purposes.
      </div>
    </footer>
  );
};

export default Footer;
