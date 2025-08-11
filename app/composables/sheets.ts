
export function useSheets() {
  const sheets = useState<string[]>("sheets", ()=>[]);
  function addSheet(sheet: string) {
    if (!sheets.value.includes(sheet)) {
      sheets.value.push(sheet);
    }
  }
  function resetSheets(newSheets: string[] = []) {
    sheets.value = [...newSheets];
  }
  return {
    sheets,
    addSheet,
    resetSheets,
  };
}
