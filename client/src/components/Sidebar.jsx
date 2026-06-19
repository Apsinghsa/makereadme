export default function Sidebar({ children }) {
  return (
    <aside className="border-r border-border p-5 bg-bg overflow-auto max-[1100px]:border-r-0 max-[1100px]:border-b max-[1100px]:grid max-[1100px]:grid-cols-3 max-[1100px]:gap-5 max-[820px]:grid-cols-1">
      {children}
    </aside>
  );
}
