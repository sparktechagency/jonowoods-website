"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSettingQuery } from "@/redux/featured/settings/settingApi";

export default function Terms() {
  const { data } = useGetSettingQuery("termsOfService");
  const terms = data?.data;
  return (
    <div className="flex  justify-center items-center my-12">
      <Card className="w-full px-4   text-black ">
        <CardHeader className=" border-b border-[#2E2E2EF5]">
          <CardTitle>Terms & Condtions</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            dangerouslySetInnerHTML={{ __html: terms }}
            className="prose max-w-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}
