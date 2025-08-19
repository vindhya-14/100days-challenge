import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;

public class Crawler {
    private final ExecutorService executor;
    private final Set<String> visitedUrls = ConcurrentHashMap.newKeySet();
    private final int maxDepth;

    public Crawler(ExecutorService executor, int maxDepth) {
        this.executor = executor;
        this.maxDepth = maxDepth;
    }

    public void startCrawling(String startUrl) {
        visitedUrls.add(startUrl);
        executor.submit(new CrawlerTask(startUrl, 0, this));
    }

    public void crawl(String url, int depth) {
        if (depth > maxDepth || visitedUrls.contains(url)) return;

        visitedUrls.add(url);
        executor.submit(new CrawlerTask(url, depth, this));
    }
}
