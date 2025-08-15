import React from "react";

import { Tabs } from "@/components/tabs";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="feed"
        options={{
          title: "Home",
          tabBarIcon: () => ({ sfSymbol: "house" }),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: () => ({ sfSymbol: "magnifyingglass" }),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: () => ({ sfSymbol: "bookmark.fill" }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => ({ sfSymbol: "person.fill" }),
        }}
      />
    </Tabs>
  );
}
