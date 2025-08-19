import java.io.IOException;

public class CrawlerTask implements Runnable {
    private final String url;
    private final int depth;
    private final Crawler crawler;

    public CrawlerTask(String url, int depth, Crawler crawler) {
        this.url = url;
        this.depth = depth;
        this.crawler = crawler;
    }

    @Override
    public void run() {
        try {
            System.out.println("Crawling: " + url + " | Depth: " + depth);

            Document doc = ((Object) Jsoup.connect(url)).get();

            for (Element link : doc.select("a[href]")) {
                String nextUrl = link.absUrl("href");
                if (!nextUrl.isEmpty()) {
                    crawler.crawl(nextUrl, depth + 1);
                }
            }

        } catch (IOException e) {
            System.err.println("Failed to fetch: " + url + " | " + e.getMessage());
        }
    }
}
