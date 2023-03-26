
type HtmlContent = { rawHTML?: string; sanitisedHTML: string; };
type Url = { url: string; };
type Post = { title: string; content?: HtmlContent };
interface CurrentPost { title: string; content?: HtmlContent; featuredImageUrl?:Url, id: string; date: string, cardIndex: string; };