import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductsList from "@/components/ProductsList";
import ResumeCart from "@/components/ResumeCart";

export default function Home() {
  return (
    <div className="max-w-[600px] mx-auto relative h-screen bg-white">
      <Header />
      <CategoryFilter />
      <ProductsList />
      <ResumeCart />
    </div>
  );
}
