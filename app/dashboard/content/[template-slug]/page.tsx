"use client"
import React, { useContext, useState } from 'react'
import FormSection from '@/app/dashboard/content/_components/FormSection'
import OutputSection from '@/app/dashboard/content/_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { chatSession } from '@/utils/AiModel'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import moment from 'moment'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { useRouter } from 'next/navigation'
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext'
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext'
import { useUser } from '@clerk/nextjs'

interface PROPS {
  params: {
    'template-slug': string;
  };
}

function CreateNewContent({ params }: PROPS) {

  const selectedTemplate: TEMPLATE | undefined = Templates?.find((item) => item.slug == params['template-slug']);
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>('');
  const { user } = useUser();
  const router = useRouter();
  const { totalUsage } = useContext(TotalUsageContext)
  const { userSubscription } = useContext(UserSubscriptionContext);
  const { setUpdateCreditUsage } = useContext(UpdateCreditUsageContext)

  const GenerateAIContent = async (formData: any) => {
    if (totalUsage >= 10000 && !userSubscription) {
      console.log("Please Upgrade");
      router.push('/dashboard/billing')
      return;
    }
    setLoading(true);
    try {
      const SelectedPrompt = selectedTemplate?.aiPrompt;
      const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;
      const result = await chatSession.sendMessage(FinalAIPrompt);
      const aiResponseText = await result?.response.text();
      
      setAiOutput(aiResponseText || 'No output received');
      await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, aiResponseText);
      setUpdateCreditUsage(Date.now());
    } catch (error) {
      console.error("Error generating AI content:", error);
    } finally {
      setLoading(false);
    }
  }

  const SaveInDb = async (formData: string, slug: string | undefined, aiResp: string) => {
    try {
      const result = await db.insert(AIOutput).values({
        formData: JSON.stringify(formData),                       
        templateSlug: slug || '',                         
        aiResponse: aiResp || '',                         
        createdBy: user?.primaryEmailAddress?.emailAddress || '',  
        createdAt: moment().format('DD/MM/yyyy'),  
      });
  
      console.log("Data saved:", result);
  
    } catch (error) {
      console.error("Error saving to DB:", error);
    }
  };
  


  return (
    <div className='p-5'>
      <Link href={"/dashboard"}>
        <Button> <ArrowLeft className="mr-2" /> Back</Button>
      </Link>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5 '>
        {/* FormSection  */}
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading} />
        {/* OutputSection  */}
        <div className='col-span-2'>
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  )
}

export default CreateNewContent;
