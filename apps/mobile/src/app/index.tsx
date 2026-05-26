import { Text, View, StyleSheet } from "react-native"
import { api } from "@workspace/backend/api"
import { useQuery } from "convex/react"

export default function Index() {
  const tasks = useQuery(api.tasks.get)

  return (
    <View style={styles.container}>
      {tasks?.map(({ _id, text }) => (
        <Text key={_id}>{text}</Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
