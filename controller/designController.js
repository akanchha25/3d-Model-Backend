const env = require("dotenv");
env.config();
const DesignSchema = require('../model/design')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");



exports.createDesign= async (req, res) => {
    try {
        console.log("createStore")
        let { title, description, design_link, price, tags } = req.body
        if ( !title || !description || !design_link || !price || !tags) {
            res.status(400).send("Fill all details")
        }
        let user = req.user;
        console.log(user)
        let design = new DesignSchema({
            model_id:uuidv4(),
            title, 
            description, 
            creator_user_id:user.user_id, 
            design_link,
            price, 
            tags
            
         });
         await design.save();
        console.log(design)
        res.status(200).send("Design added successfully",design)


    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
}

exports.viewDesigns = async (req, res) => {
    try{
        let designs = await DesignSchema.find();
        res.status(200).send({designs});
    } catch(err){
        console.log(err)
        res.send(err)
    }

}

exports.designById = async(req, res)=>{
    try{
        const _id = req.params.id;
        const design = await DesignSchema.findById(_id);
        if(!design)return res.status(404).json({message:"Design not found!"})
        res.send(design);
    }catch (err){
        res.status(500).json(err);
    }
}


exports.updateDesignById = async (req, res) => {
    try{
        console.log("update")
        const _id = req.params.id
        const {title} = req.body
        const getDesign = await DesignSchema.findById(_id)
        console.log({getDesign})
        if(!getDesign){
            return res.status(404).json({message:`Design with id ${_id} not found!`})
        }
        let user = req.user;
        console.log({user})
        if(user.user_id !== getDesign.creator_user_id){
            return res.status(403).json({message: "Forbidden"})
        }
        let design = await DesignSchema.findByIdAndUpdate(
            _id,
            {
                title:title, 
            },
            {new:true,runValidators: true}
        )

        return res.send({message:"Design successfully updated",design})
        
    } catch(err){
        console.log(err)
        res.send(err)
    }
}



exports.deleteDesignById = async (req, res) => {
    try{
        console.log("delete")
        const _id = req.params.id
        const {title} = req.body
        const getDesign = await DesignSchema.findById(_id)
        console.log({getDesign})
        if(!getDesign){
            return res.status(404).json({message:`Design with id ${_id} not found!`})
        }
        let user = req.user;
        console.log({user})
        if(user.user_id !== getDesign.creator_user_id){
            return res.status(403).json({message: "Forbidden"})
        }
        let design = await DesignSchema.findByIdAndRemove(
            _id
        )

        return res.send({message:"Design successfully removed",design})
        
    } catch(err){
        console.log(err)
        res.send(err)
    }
}

// exports.searchDesign = async(req, res) => {
//     const { tags, title, description } = req.body;

//   const searchQuery = {
//     $or: [
//       { tags: { $regex: tags, $options: 'i' } },
//       { title: { $regex: title, $options: 'i' } },
//       { description: { $regex: description, $options: 'i' } },
//     ],
//   };

//   const design = await DesignSchema.find(searchQuery)
//   console.log(design)
    

//     return res.json(design);
  
// }

exports.searchDesign = async (req, res) => {
  const { tags, title, description } = req.body;

  const searchQuery = {};
  if (tags) {
    searchQuery.tags = { $regex: tags, $options: 'i' };
  }
  if (title) {
    searchQuery.title = { $regex: title, $options: 'i' };
  }
  if (description) {
    searchQuery.description = { $regex: description, $options: 'i' };
  }

  try {
    const designs = await DesignSchema.find(searchQuery);
    console.log(designs);
    return res.json(designs);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to search for designs');
  }
};


exports.UploadImages = async (req, res) => {
    try {
      if (!req.files) {
        console.log(req.files);
        return res.status(500).json("inSufficient data");
      }
  
      const newURLs = req.files.map((item) => {
        return { s3_url: item.location};
      });
      console.log(newURLs);
  
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  };
  




