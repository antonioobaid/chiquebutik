export default function ProductCard({ product }) {
  return (
    <div className=" border p-4 rounded-lg shadow hover:shadow-lg transition">
      <img
        src={product.image_url}
        alt={product.title}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <h2 className="text-lg font-semibold">{product.title}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="mt-2 font-bold">Price: {product.price} SEK</p>
      <p className="text-sm text-gray-500">
        {product.category} | {product.size} | {product.color}
      </p>
    </div>
  )
}
