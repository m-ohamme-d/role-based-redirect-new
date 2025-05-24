import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Mail, MessageSquare, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Support = () => {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Mock send message
    toast.success("Support request sent", {
      description: "We'll get back to you shortly"
    });
    
    // Reset form
    setMessage("");
  };

  // FAQs data
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address and follow the instructions sent to your email."
    },
    {
      question: "How can I create a new report?",
      answer: "Navigate to the Reports page using the sidebar menu. Click on 'Generate New Report', select the report type, date range, and format, then click 'Generate Report'."
    },
    {
      question: "What permission levels are available?",
      answer: "The system has four permission levels: Admin, Manager, Team Lead, and User. Each role has different access levels and capabilities within the platform."
    },
    {
      question: "How do I add team members to my department?",
      answer: "As a Manager or Team Lead, you can add team members by going to your Team page. Click on 'Add Member' and follow the instructions to invite them to your team."
    },
    {
      question: "Can I export data from the system?",
      answer: "Yes, most data can be exported. Look for the export or download button on the relevant pages. Reports can be exported in PDF, Excel, or CSV formats."
    },
    {
      question: "How do I view my notification history?",
      answer: "Click on the bell icon in the top navbar to see recent notifications. For a full history, click on 'View all' or navigate to the Notifications page."
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
      <p className="text-gray-600">Find answers to common questions or contact support</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search FAQs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mb-4"
                />
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {faqs
                  .filter(faq => 
                    query === "" || 
                    faq.question.toLowerCase().includes(query.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
              
              {query && !faqs.some(
                faq => 
                  faq.question.toLowerCase().includes(query.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(query.toLowerCase())
              ) && (
                <div className="text-center py-4">
                  <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                  <p>No matching FAQs found. Try a different search or contact support.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Support
                </h3>
                <p className="text-gray-600 mt-1">support@example.com</p>
                <p className="text-sm text-gray-500">Response time: 24-48 hours</p>
              </div>
              
              <div>
                <h3 className="font-medium">Phone Support</h3>
                <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500">Monday-Friday: 9am-5pm EST</p>
              </div>
              
              <div>
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-gray-600 mt-1">Available for premium users</p>
                <Button className="mt-2" variant="outline" size="sm">
                  Start Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                <FileText className="h-4 w-4" />
                <span>User Manual</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                <FileText className="h-4 w-4" />
                <span>Video Tutorials</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                <FileText className="h-4 w-4" />
                <span>API Documentation</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
