import NewCustomOrderCustomer from "~/services/email_new/email-templates/customer.custom-order";
import InquiryEmailTemplate from "~/services/email_new/email-templates/inquiry.core";

const Home = () => {
  return (
    <InquiryEmailTemplate
      userName="Andrew Hunn"
      userEmail="ahunn@umich.edu"
      question={`"Hey I had a question about your store. 
      When do you get new items? I'm looking for a new hat and was wondering
      if you did anything 'pokemon' related. Thanks!
      "`}
    />
  );
};

export default Home;
