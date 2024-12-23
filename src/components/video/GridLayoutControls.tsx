import { Grid2x2, LayoutGrid, Grid } from "lucide-react";
import { Button } from "../ui/button";

type GridLayout = '2x2' | '3x2' | '4x2';

interface GridLayoutControlsProps {
  gridLayout: GridLayout;
  setGridLayout: (layout: GridLayout) => void;
}

export const GridLayoutControls = ({ gridLayout, setGridLayout }: GridLayoutControlsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant={gridLayout === '2x2' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setGridLayout('2x2')}
      >
        <Grid2x2 className="h-4 w-4" />
      </Button>
      <Button
        variant={gridLayout === '3x2' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setGridLayout('3x2')}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={gridLayout === '4x2' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setGridLayout('4x2')}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
};