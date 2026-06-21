import { ListTodo as LucideListTodo } from "lucide-react-native";
import { View } from "react-native";
import { withUniwind } from "uniwind";

const ListTodo = withUniwind(LucideListTodo);

type AppLogoProps = {
  /** Tile edge length in pixels. Defaults to 28 to match the web header. */
  size?: number;
};

/**
 * Tasklit app mark — the lucide `list-todo` glyph on a solid tile. Mirrors the
 * web wordmark logo. Square (no radius) and theme-aware: the tile is the
 * foreground color with a background-colored glyph, so it stays crisp in both
 * light and dark without hardcoded colors.
 */
export function AppLogo({ size = 28 }: AppLogoProps) {
  return (
    <View
      className="items-center justify-center border border-border bg-foreground"
      style={{ width: size, height: size }}
    >
      <ListTodo size={size * 0.6} colorClassName="accent-background" />
    </View>
  );
}
