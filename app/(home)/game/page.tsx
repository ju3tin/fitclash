import Footer from '../../../components/footer'
import Video from '../../../components/video'
import Selection from '../../../components/selection'
import { PreloadResources } from '../../../components/externalstyle'
import Masthead from '../../../components/masthead'
import FrontContent from '../../../components/frontcontent'
import SearchContent from '../../../components/searchcontent'
import instantsearch from 'instantsearch.js'
import { Analytics } from "@vercel/analytics/react"


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