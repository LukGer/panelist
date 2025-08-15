import { authClient } from "@/auth/client";
import { LoadingScreen } from "@/components/loading-screen";
import { Tabs } from "@/components/tabs";
import { Redirect } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!session) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

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
