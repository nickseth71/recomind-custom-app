// const Header = ({ store }) => {
//added an extra prop sidebarOpen 

 const Header = ({ store, sidebarOpen }) => { 
  return (
    // <header className="fixed top-0 right-0 left-64 z-40 bg-surface/60 backdrop-blur-xl border-b border-outline-variant flex justify-between items-center h-16 px-margin-desktop transition-all duration-300">
    // <header className="fixed top-0 right-0 left-64 z-40 bg-surface/60 backdrop-blur-xl border-b border-outline-variant flex justify-end items-center h-16 px-margin-desktop transition-all duration-300">
    <header className={`fixed top-0 right-0 z-40 bg-surface/60 backdrop-blur-xl border-b border-outline-variant flex justify-end items-center h-16 px-margin-desktop transition-all duration-300 
      ${ sidebarOpen ? "left-64" : "left-20" }`}>
      {/* <div className="flex items-center bg-primary-container border border-outline-variant rounded-full px-4 py-1.5 w-96">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">
          search
        </span>
        <input
          className="bg-transparent border-none focus:ring-0 text-body-md w-full text-on-surface placeholder-on-surface-variant/50"
          placeholder="Search AI product vectors..."
          type="text"
        />
      </div> */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant">
          {/* <span className="w-2 h-2 rounded-full bg-secondary ai-pulse"></span> */}
          <span className="w-2 h-2 rounded-full bg-[#00e29e] ai-pulse"></span>
          <span className="text-label-md font-label-md uppercase text-on-surface-variant">
            Plan: Enterprise
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-on-surface-variant hover:text-secondary transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="h-8 w-8 rounded-full border border-secondary overflow-hidden">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              data-alt="A professional headshot of a modern software engineer with a neutral expression, set against a dark, moody studio background with subtle blue rim lighting. The style is crisp and high-contrast, matching a sophisticated enterprise AI platform's aesthetic."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWxcA0MP_cXEkL_6nJeBuyio_uKe5f5WkWJ8opZwREN4uQy-xNTiNrb0WdHQIyDpQfceSxi-VdstHoTHuQ6kY_y_WOLeEKOw4eXXgQC2zL8RH-9CpYp6S5OIkxnqq_6S3a6C0Y4T9rCq53_nc7m7Y8B61jyovmw5lVO4N9B3f5RJCdz3I_vgaiK0X0mwn8G3dLOBkdrkbXRFHHYfO-lDsYbiNK8K9Km9J7sZ-OjE-Dgh3V6SjLw6hRaY9kvDS5GpAuNBqjIu2MSUo"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
