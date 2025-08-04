interface amogus {
  site: string,
  page: string,
}



export function useWikiMeta(meta?: amogus) {
  const _state = useState<amogus>("wikiMeta", ()=>{return{
    site: "",
    page: ""
  }});
  if (meta) {
    _state.value = meta;
  }
  return _state;
}