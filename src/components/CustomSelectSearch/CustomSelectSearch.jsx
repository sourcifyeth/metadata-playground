import Fuse from "fuse.js";
import SelectSearch from "react-select-search";
import "./style.css";
function fuzzySearch(options) {
  const fuse = new Fuse(options, {
    keys: ["name", "groupName", "items.name"],
    threshold: 0.6,
  });
  return (value) => {
    if (!value.length) {
      return options;
    }
    return fuse.search(value);
  };
}

export default function CustomSelectSearch(props) {
  return (
    <SelectSearch
      {...props}
      search
      filterOptions={fuzzySearch}
      emptyMessage="Not found"
      placeholder="Choose network"
    />
  );
}
