import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Team from "./pages/Team";
import Beneficiary from "./pages/Beneficiary";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

function App() {
	return (
		<AuthProvider>
			<Router>
				<ScrollToTop />
				<div className="flex flex-col min-h-screen">
					<Navbar />
					<main className="flex-grow pt-16">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/team" element={<Team />} />
							<Route path="/beneficiary" element={<Beneficiary />} />
							<Route path="/gallery" element={<Gallery />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/admin/login" element={<AdminLogin />} />
							<Route
								path="/admin"
								element={
									<ProtectedRoute>
										<Admin />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</main>
					<Footer />
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
