import { WC, Presentable, DefineComponent } from "../../../lib";
import { SearchBar } from "../search-bar";
import { JsonView } from "../json-view";

interface SearchResult {
  totalCount: number;
  value: SearchResultItem[];
}
interface SearchResultItem {
  url: string;
  height: number;
  width: number;
  thumbnail: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
  base64Encoding: null;
  name: string;
  title: string;
  provider: {
    name: string;
    favIcon: string;
    favIconBase64Encoding: string;
  };
  imageWebSearchUrl: string;
  webpageUrl: string;
}

const search = async (text: string): Promise<SearchResult> => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "514e1aa381mshfd921a4b6e61bacp10b79cjsn4790fb7b62b9",
      "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
    },
  };


  return await fetch(
    `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=${encodeURI(text)}&pageNumber=1&pageSize=10&autoCorrect=true`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
};

interface Props {}

@DefineComponent("search-page", { noWrap: true })
export class SearchPage extends Presentable<Props> {
  state = { content: "", resultList: [] as SearchResultItem[] };
  search = async (text: string) => {
    const data = await search(text);

    this.setState({ 
        resultList: data.value,
        content: JSON.stringify(data, null, 2) 
    });
  };

  buildTemplate() {
    return (
      <div>
        <SearchBar onSearchClick={this.search} />
        <div style={{ display: 'flex', gap: '10px' }}>
            {
                this.state.resultList.map((item) => {
                    return (
                        <div style={{ 
                            flexWrap: 'wrap',
                            width: 'min-content',
                            border: '1px solid black',
                            margin: '4px',
                            maxHeight: '200px',
                        }}>
                            <img src={item.thumbnail} width='150px' hight='150px' />
                            <p style={{ margin: '4px' }}>{item.title}</p>
                        </div>
                    )
                })
            }
        </div>
        {/* <JsonView content={this.state.content} /> */}
      </div>
    );
  }
}
