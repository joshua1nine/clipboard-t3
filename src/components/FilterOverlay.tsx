import React, { useState } from "react";

interface Props {
  filters: any;
  setFilters: any;
  setToggleFilter: any;
  tags: any;
}

export const FilterOverlay = ({
  filters,
  setFilters,
  setToggleFilter,
  tags,
}: Props) => {
  const [typeFilter, setTypeFilter] = useState(filters.type);
  const [tagsFilter, setTagsFilter] = useState<any>(filters.tags);

  const handelSubmit = (e: any) => {
    e.preventDefault();
    setFilters((currentValue: any) => ({
      ...currentValue,
      type: typeFilter,
      tags: tagsFilter,
    }));
    setToggleFilter(false);
  };

  const handleTypeFilterChange = (e: any) => {
    setTypeFilter(e.target.value);
  };

  const handleTagFilterChange = (e: any) => {
    let box = e.target;
    if (box.checked) {
      setTagsFilter((current: any) => [...current, box.value]);
    } else {
      setTagsFilter(tagsFilter.filter((f: any) => f !== box.value));
    }
  };

  const handleClear = () => {
    setFilters({ type: "none", tags: [] });
    setTypeFilter("");
    setTagsFilter([]);
  };

  return (
    <aside className="z-50 -mt-2 w-full rounded-b-lg border border-t-0 border-blue bg-white p-3 sm:absolute sm:right-0 md:max-w-xs">
      <form onSubmit={handelSubmit}>
        <div>
          <h2 className="mb-2 text-base">Types:</h2>
          <div className="mb-3 flex w-full gap-4">
            <label className="filter-btn flex-1">
              <input
                className="hidden"
                type="radio"
                name="type"
                id="STEM"
                value="STEM"
                checked={typeFilter === "STEM"}
                onChange={handleTypeFilterChange}
              />
              <span className="block rounded-md border border-blue py-1 text-center">
                STEM
              </span>
            </label>
            <label className="filter-btn flex-1">
              <input
                className="hidden"
                type="radio"
                name="type"
                id="ELA"
                value="ELA"
                checked={typeFilter === "ELA"}
                onChange={handleTypeFilterChange}
              />
              <span className="block rounded-md border border-blue py-1 text-center">
                ELA
              </span>
            </label>
          </div>
        </div>
        {/* <div>
					<h2 className='text-base mb-2'>Availability:</h2>
					<div className='flex gap-4 w-full mb-3'>
						<label className='filter-btn flex-1'>
							<input
								className='hidden'
								type='radio'
								name='available'
								id='today'
								value='today'
							/>
							<span className='block border border-blue rounded-md py-1 text-center'>
								Today
							</span>
						</label>
						<label className='filter-btn flex-1'>
							<input
								className='hidden'
								type='radio'
								name='available'
								id='week'
								value='week'
							/>
							<span className='block border border-blue rounded-md py-1 text-center'>
								This Week
							</span>
						</label>
					</div>
				</div> */}
        <div>
          <h2 className="mb-2 text-base">Tags:</h2>
          <div className="mb-3 flex w-full flex-wrap gap-2">
            {tags?.map((tag: any) => {
              return (
                <label key={tag.id} className="filter-btn">
                  <input
                    className="hidden"
                    type="checkbox"
                    name={tag.tag}
                    id={tag.tag}
                    value={tag.tag}
                    checked={tagsFilter.some((f: any) => f.includes(tag.tag))}
                    onChange={handleTagFilterChange}
                  />
                  <span className="inline-block rounded-md border border-blue py-1 px-3">
                    {tag.tag}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <div>
          <div className="mt-8">
            <button
              className="block w-full rounded-md border border-blue bg-blue py-2 text-white"
              type="submit"
            >
              Apply
            </button>
            <button
              className="block w-full rounded-md border-none bg-white py-1 text-blue underline"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </aside>
  );
};
