import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        String startUrl = "https://example.com";  // starting point
        int maxDepth = 2; // how deep to crawl
        int threadCount = 5; // number of parallel threads

        ExecutorService executor = Executors.newFixedThreadPool(threadCount);

        Crawler crawler = new Crawler(executor, maxDepth);
        crawler.startCrawling(startUrl);

        executor.shutdown();
    }
}
