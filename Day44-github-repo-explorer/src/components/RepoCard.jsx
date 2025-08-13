import { timeAgo } from "../utils/format";

export default function RepoCard({ repo }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start mb-3">
        <svg 
          className="flex-shrink-0 mt-1 mr-2 text-blue-400" 
          width="18" 
          height="18" 
          viewBox="0 0 16 16" 
          fill="currentColor" 
          aria-hidden="true"
        >
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v10.9a.6.6 0 0 1-.97.47L9.5 11.6 6 13.87a.6.6 0 0 1-.94-.5V2.5A1.5 1.5 0 0 0 3.5 1h-1.1A.4.4 0 0 0 2 1.4v1.1z"/>
        </svg>
        <a 
          className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors break-words"
          href={repo.html_url} 
          target="_blank" 
          rel="noreferrer"
        >
          {repo.name}
        </a>
      </div>

      {repo.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 items-center text-xs">
        {repo.language && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
            {repo.language}
          </span>
        )}
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
          <svg 
            className="mr-1 w-3 h-3" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {repo.stargazers_count.toLocaleString()}
        </span>
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
          <svg 
            className="mr-1 w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {repo.forks_count.toLocaleString()}
        </span>
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
          <svg 
            className="mr-1 w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Updated {timeAgo(repo.updated_at)}
        </span>

        {repo.license && repo.license.spdx_id && repo.license.spdx_id !== "NOASSERTION" && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
            {repo.license.spdx_id}
          </span>
        )}

        {repo.archived && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
            Archived
          </span>
        )}
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {repo.topics.slice(0, 3).map(topic => (
            <a
              key={topic}
              href={`https://github.com/topics/${topic}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              #{topic}
            </a>
          ))}
          {repo.topics.length > 3 && (
            <span className="text-xs text-gray-500 self-center">
              +{repo.topics.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}