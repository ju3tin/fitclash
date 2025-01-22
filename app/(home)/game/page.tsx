import Footer from '../../../components/footer'
import Video from '../../../components/video'
import Selection from '../../../components/selection'
import { PreloadResources } from '../../../components/externalstyle'
import Masthead from '../../../components/masthead'
import FrontContent from '../../../components/frontcontent'
import SearchContent from '../../../components/searchcontent'
import { searchBox, hits } from 'instantsearch.js/es/widgets'
import { Analytics } from "@vercel/analytics/react"
import algoliasearch from 'algoliasearch/lite'


// Including InstantSearch.js library and styling
const loadSearch = function() {
  const loadCSS = function(src: string) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = src;
    link.media = 'all';
    document.head.appendChild(link);
  };

  var script = document.createElement('script');
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", "https://cdn.jsdelivr.net/npm/instantsearch.js@2.3.3/dist/instantsearch.min.js");
  script.addEventListener("load", function() {
    // Instantiating InstantSearch.js with Algolia credentials
            const searchClient = algoliasearch(
              process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
              process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
            );
            const search = (window as any).instantsearch({
              searchClient,
              indexName: 'minimal_mistakes',
              configure: {
                restrictSearchableAttributes: ['title', 'content']
              }
            });

    const hitTemplate = function(hit) {
      const url = hit.url;
      const hightlight = hit._highlightResult;
      const title = hightlight.title && hightlight.title.value  || "";
      const content = hightlight.html && hightlight.html.value  || "";

      return `
        <div class="list__item">
          <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
            <h2 class="archive__item-title" itemprop="headline"><a href="/minimal-mistakes${url}">${title}</a></h2>
            <div class="archive__item-excerpt" itemprop="description">${content}</div>
          </article>
        </div>
      `;
    }

    // Adding searchbar and results widgets
    search.addWidget(
      searchBox({
        container: '.search-searchbar',
      //  poweredBy: true,
        placeholder: 'Enter your search term...'
      })
    );
    search.addWidget(
      hits({
        container: '.search-hits',
        templates: {
          item: hitTemplate,
          empty: 'No results',
        }
      })
    );

    if (!search.started) {
      search.start();
    }
  });
  document.body.appendChild(script);

  loadCSS("https://cdn.jsdelivr.net/npm/instantsearch.js@2.3.3/dist/instantsearch.min.css");
  loadCSS("https://cdn.jsdelivr.net/npm/instantsearch.js@2.3.3/dist/instantsearch-theme-algolia.min.css");
};

export default function Page() {
  return (
    <main>
      <PreloadResources />
     <Masthead />
            <FrontContent />
            <SearchContent />
     
      <Footer />
      <Analytics/>
    </main>
  )
}