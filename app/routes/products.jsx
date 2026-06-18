import { redirect } from "react-router";

export function loader() {
  return redirect("/app/products");
}

export default function ProductsRedirect() {
  return null;
}
