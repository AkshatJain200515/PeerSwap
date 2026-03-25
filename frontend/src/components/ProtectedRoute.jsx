export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("TOKEN IN PROTECTED ROUTE:", token);

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}