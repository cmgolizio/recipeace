const LoadingSkeleton = ({ type }) => {
  return type === "ingredient" ? (
    <ul className='mt-10 space-y-2'>
      {[...Array(6)].map((_, idx) => (
        <li
          key={`skeleton-${idx}`}
          className='flex justify-between items-center dark:bg-gray-100 bg-gray-800  p-2 rounded'
        >
          <div className='w-full bg-gray-300 rounded-md'></div>
          <div className='h-3 bg-gray-300 rounded mt-3 w-3/4'></div>
          <div className='h-2 bg-gray-300 rounded mt-2 w-1/2'></div>
        </li>
      ))}
    </ul>
  ) : type === "recipe" ? (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 animate-pulse'>
      {[...Array(6)].map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className='p-4 border rounded-lg shadow bg-gray-100 h-56'
        >
          <div className='w-full h-32 bg-gray-300 rounded-md'></div>
          <div className='h-4 bg-gray-300 rounded mt-3 w-3/4'></div>
          <div className='h-3 bg-gray-300 rounded mt-2 w-1/2'></div>
        </div>
      ))}
    </div>
  ) : null;
};

export default LoadingSkeleton;
