import { sum } from "../utils/format";

export default function StatsBar({ repos }) {
  const totalStars = sum(repos.map(r => r.stargazers_count));
  const totalForks = sum(repos.map(r => r.forks_count));
  const total = repos.length;
  const avgStars = total > 0 ? (totalStars / total).toFixed(1) : 0;
  const avgForks = total > 0 ? (totalForks / total).toFixed(1) : 0;
  
  const topStar = [...repos].sort((a,b) => b.stargazers_count - a.stargazers_count)[0];
  const topFork = [...repos].sort((a,b) => b.forks_count - a.forks_count)[0];
  const newestRepo = [...repos].sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6" role="region" aria-label="Repository statistics">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Repository Stats</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Total Repos */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Total Repos</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        
        {/* Total Stars */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Total Stars
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalStars}</div>
          <div className="text-xs text-gray-500">Avg: {avgStars} per repo</div>
        </div>
        
        {/* Total Forks */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Total Forks
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalForks}</div>
          <div className="text-xs text-gray-500">Avg: {avgForks} per repo</div>
        </div>
        
        {/* Top Starred Repo */}
        {topStar && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 md:col-span-2">
            <div className="text-sm font-medium text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Most Starred
            </div>
            <a 
              href={topStar.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="text-md font-medium text-gray-900 hover:text-indigo-600 transition-colors inline-flex items-center"
            >
              {topStar.name}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 mr-2">{topStar.stargazers_count} stars</span>
              <span className="text-sm text-gray-500">{topStar.forks_count} forks</span>
            </div>
          </div>
        )}
        
        {/* Newest Updated Repo */}
        {newestRepo && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 md:col-span-2">
            <div className="text-sm font-medium text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recently Updated
            </div>
            <a 
              href={newestRepo.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="text-md font-medium text-gray-900 hover:text-indigo-600 transition-colors inline-flex items-center"
            >
              {newestRepo.name}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <div className="text-sm text-gray-500 mt-1">
              Updated {new Date(newestRepo.pushed_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}