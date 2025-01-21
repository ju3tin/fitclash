
import Footer from '../../components/footer'
import Video from '../../components/video'
import Selection from '../../components/selection'
import { PreloadResources } from '../../components/externalstyle'
export default function Page() {
  return (
    <main>
   
      <PreloadResources />
      <Video />
      <Selection />
      <Footer />
    </main>
  )
}