import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../redux/thunks/productThunks";
import { setFilters } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, categories, filters, pages, page } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    dispatch(setFilters({ keyword }));
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const applyFilter = (patch) => {
    dispatch(setFilters(patch));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <section className="mb-10">
        <p className="text-clay uppercase tracking-widest text-xs font-semibold mb-2">New arrivals, thoughtfully curated</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink max-w-2xl leading-tight">
          Everyday goods, made to last a little longer.
        </h1>
      </section>

      <div className="flex flex-wrap gap-3 mb-8 items-center">
        <select
          value={filters.category}
          onChange={(e) => applyFilter({ category: e.target.value })}
          className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(e) => applyFilter({ minPrice: e.target.value })}
          className="border border-ink/15 rounded-full px-4 py-2 text-sm w-28 bg-white"
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => applyFilter({ maxPrice: e.target.value })}
          className="border border-ink/15 rounded-full px-4 py-2 text-sm w-28 bg-white"
        />

        <select
          value={filters.sort}
          onChange={(e) => applyFilter({ sort: e.target.value })}
          className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>

        {filters.keyword && (
          <span className="text-sm text-ink/60">
            Results for "<strong>{filters.keyword}</strong>"
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink/50">Loading products…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-ink/50">No products match your filters.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => dispatch(fetchProducts({ ...filters, page: p }))}
              className={`w-9 h-9 rounded-full text-sm ${p === page ? "bg-ink text-paper" : "border border-ink/15"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
