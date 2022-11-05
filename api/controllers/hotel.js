import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
   const newHotel = new Hotel(req.body);

   try {
      const savedHotel = await newHotel.save();
      res.status(200).json(savedHotel);
   } catch (error) {
      next(error);
   }
};

export const updateHotel = async (req, res, next) => {
   try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
         req.params.id,
         {
            $set: req.body,
         },
         { new: true }
      );
      res.status(200).json(updatedHotel);
   } catch (error) {
      next(error);
   }
};

export const deleteHotel = async (req, res, next) => {
   try {
      await Hotel.findByIdAndDelete(req.params.id);
      res.status(200).json("Hotel deleted");
   } catch (error) {
      next(error);
   }
};

export const getHotel = async (req, res, next) => {
   try {
      const hotel = await Hotel.findById(req.params.id);
      res.status(200).json(hotel);
   } catch (error) {
      next(error);
   }
};

export const getAllHotels = async (req, res, next) => {
   const { min, max, ...others } = req.query;
   try {
      const hotels = await Hotel.find({
         ...others,
         cheapestPrice: { $gt: min || 1, $lt: max || 999 },
      }).limit(req.query.limit);
      res.status(200).json(hotels);
   } catch (error) {
      next(error);
   }
};

export const countByCity = async (req, res, next) => {
   try {
      const berlinCount = await Hotel.countDocuments({ city: "berlin" });
      const madridCount = await Hotel.countDocuments({ city: "madrid" });
      const londonCount = await Hotel.countDocuments({ city: "london" });
      res.status(200).json([
         { city: "berlin", count: berlinCount },
         { city: "madrid", count: madridCount },
         { city: "london", count: londonCount },
      ]);
   } catch (error) {
      next(error);
   }
};

export const countByType = async (req, res, next) => {
   try {
      const hotelCount = await Hotel.countDocuments({ type: "hotel" });
      const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
      const resortCount = await Hotel.countDocuments({ type: "resort" });
      const villaCount = await Hotel.countDocuments({ type: "villa" });
      const cottageCount = await Hotel.countDocuments({ type: "cottage" });
      res.status(200).json([
         { type: "hotels", count: hotelCount },
         { type: "apartments", count: apartmentCount },
         { type: "resorts", count: resortCount },
         { type: "villas", count: villaCount },
         { type: "cottages", count: cottageCount },
      ]);
   } catch (error) {
      next(error);
   }
};

export const getHotelRooms = async (req, res, next) => {
   try {
      const hotel = await Hotel.findById(req.params.id);
      const list = await Promise.all(
         hotel.rooms.map((room) => {
            return Room.findById(room);
         })
      );
      res.status(200).json(list);
   } catch (error) {
      next(error);
   }
};
