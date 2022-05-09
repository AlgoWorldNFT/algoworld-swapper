const NavBar = () => (
  <div className="navbar bg-black ">
    <div className="flex-1">
      <a className="btn btn-ghost normal-case text-xl">AlgoWorld Swapper</a>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal p-0">
        <li>
          <a>Create</a>
        </li>
        <li>
          <a>Browse</a>
        </li>
        <li>
          <a>About</a>
        </li>
        <li tabIndex={0}>
          <a>
            Profile
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </a>
          <ul className="p-2 bg-base-100">
            <li>
              <a>My Swappers</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </li>
        <li>
          <a>Connect Wallet</a>
        </li>
      </ul>
    </div>
  </div>
);

export default NavBar;
