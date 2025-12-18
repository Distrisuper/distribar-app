import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import ProductsList from "./components/ProductsList";

export default function Home() {
  return (
    <>
      <div className="max-w-[600px] mx-auto">
        <Header />
      </div>
      <CategoryFilter />
      <ProductsList />
    </>
  );
}
