interface IConstructor {
  root: string,
  query: string,
  loaderSelector: string,
  onResolved: <T>(data:Array<T>) => void,
  onRejected: () => void
}

export default class ApiService {
  root: string
  query: string
  onResolved: <T>(data:Array<T>) => void
  onRejected: () => void
  loader: { spinner: Element }
  

  constructor({ root, query, loaderSelector, onResolved, onRejected } : IConstructor) {
    this.root = root;
    this.query = query;
    this.onResolved = onResolved;
    this.onRejected = onRejected;
    this.loader = this.getLoader(loaderSelector);
  }

  getLoader(loader:string) {
    const spinner = document.querySelector(`${loader}`)!;
      return { spinner };
   
    
  }

  fetch() {
    this.loader.spinner.classList.remove("is-hidden");
    fetch(`${this.root}${this.query}`)
      .then(this.onFetch)
      .then((response) => {
        this.loader.spinner.classList.add("is-hidden");
        this.onResolved(response);
      })
      .catch((response) => {
        this.loader.spinner.classList.add("is-hidden");
        this.onRejected();
      });
  }

  onFetch<T>(response:any):Array<T> {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) {
      throw "Invalid entry. Please try again.";
    } else {
      throw "It seems there are some server issues.";
    }
  }
}
