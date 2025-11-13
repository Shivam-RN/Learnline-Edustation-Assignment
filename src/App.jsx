import React, { useState, useMemo } from "react";
import laptop from "./assets/laptop.webp";
import smartphone from "./assets/smartphone.avif";
import Tshirt from "./assets/Tshirt.avif";
import jeans from "./assets/jeans.avif";
import wardrobe from "./assets/wardrobe.avif";
import diningtable from "./assets/diningtable.avif"

const initialProducts = [
  { id: 1, name: "Laptop", category: "Electronics", price: 1200, img: laptop },
  { id: 2, name: "T-Shirt", category: "Clothing", price: 25, img: Tshirt },
  { id: 3, name: "Wardrobe", category: "Furniture", price: 15, img: wardrobe },
  { id: 4, name: "Smartphone", category: "Electronics", price: 800, img: smartphone },
  { id: 5, name: "Jeans", category: "Clothing", price: 50, img: jeans },
  { id: 6, name: "Diningtable", category: "Furniture", price: 20, img: diningtable },
];
const App = () => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [cart, setCart] = useState({});

  const categories = useMemo(() => {
    const s = new Set(initialProducts.map((p) => p.category));
    return ["All", ...Array.from(s)];
  }, []);

  const displayedProducts = useMemo(() => {
    let list = category === "All" ? initialProducts.slice() : initialProducts.filter((p) => p.category === category);

    const q = search.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [category, search, sort]);

  function addToCart(product) {
    setCart((prev) => {
      const prevEntry = prev[product.id];
      return {
        ...prev,
        [product.id]: { product, qty: prevEntry ? prevEntry.qty + 1 : 1 }
      };
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  function changeQty(productId, delta) {
    setCart((prev) => {
      const entry = prev[productId];
      if (!entry) return prev;
      const newQty = entry.qty + delta;
      const next = { ...prev };
      if (newQty <= 0) delete next[productId];
      else next[productId] = { ...entry, qty: newQty };
      return next;
    });
  }

  function clearFilters() {
    setCategory("All");
    setSearch("");
    setSort("none");
  }

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((sum, e) => sum + e.product.price * e.qty, 0);

  return (
    <div className="min-h-screen bg-gray-300 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Dynamic Product Filter & Cart</h1>
          <p className="text-sm text-gray-600">Browse, search, sort and add products to the cart.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Categories */}
                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1 rounded-full border text-sm ${category === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search + Sort */}
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border rounded-md w-52 focus:ring-2 focus:ring-blue-300"
                  />

                  <select value={sort} onChange={(e) => setSort(e.target.value)} className=" w-36 px-1 text-center py-2 border text-sm rounded-md">
                    <option value="none">Sort</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                  </select>

                  <button onClick={clearFilters} className="px-3 py-2 border rounded-md text-sm">
                    Clear
                  </button>

                </div>
              </div>

              {/* Product Grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {displayedProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col">
                    <img src={p.img} alt={p.name} className="h-40 w-full object-cover" />

                    <div className="p-4 flex-1 flex flex-col bg-amber-100">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{p.name}</h3>
                        <p className="text-sm text-gray-500">{p.category}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="font-bold">${p.price}</div>
                        <button
                          onClick={() => addToCart(p)}
                          className="px-3 py-1 rounded-md bg-green-500 text-white text-sm hover:bg-green-600"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {displayedProducts.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No products found.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Cart */}
          <aside>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Shopping Cart</h2>

              {cartItems.length === 0 ? (
                <div className="text-gray-500">Your cart is empty.</div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-start gap-3">
                      <img src={product.img} alt={product.name} className="w-16 h-12 object-contain rounded-md" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">${product.price} × {qty} = <span className="font-semibold">${product.price * qty}</span></div>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => changeQty(product.id, -1)} className="px-2 py-1 border rounded">-</button>
                          <div className="px-2">{qty}</div>
                          <button onClick={() => changeQty(product.id, +1)} className="px-2 py-1 border rounded">+</button>
                          <button onClick={() => removeFromCart(product.id)} className="ml-auto text-sm text-red-500 border rounded-full p-2">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <div>Total</div>
                      <div>${total}</div>
                    </div>
                    <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Checkout</button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App

