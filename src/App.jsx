import { useEffect } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, logout } from './reduxToolkit/slices/authSlice';

// Packages and Libraries
import Swal from 'sweetalert2';

// Components
import Navbar from './Components/Navigation/Navbar';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Load user on initial app load
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const handleLogin = () => {
    Swal.fire({
      title: "Success!",
      text: "You have been logged in",
      icon: "success"
    });
  };

  const handleLogout = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-[#1B61AD] rounded-sm text-white px-6 py-2 m-2 hover:bg-white border border-[#1B61AD] hover:text-[#1B61AD]",
        cancelButton: "bg-red-400 rounded-sm text-white px-6 py-2 hover:bg-white border border-red-400 hover:text-red-400"
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You want to log out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        swalWithBootstrapButtons.fire({
          title: "Logged Out!",
          text: "You have been logged out.",
          icon: "success"
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "You are still logged in :)",
          icon: "error"
        });
      }
    });
  };

  return (
    <>
      <Navbar 
        isLoggedIn={isAuthenticated} 
        handleLogin={handleLogin} 
        handleLogout={handleLogout}
      />
    </>
  );
}

export default App;