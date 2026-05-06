export interface Food {
  name: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  primaryNutrient: 'carb' | 'protein' | 'fat' | 'fiber';
}

export const foodDatabase: Food[] = [
  // 主食类
  { name:'米饭', unit:'100g', calories:116, protein:2.6, carbs:25.9, fat:0.3, category:'主食类', primaryNutrient:'carb' },
  { name:'燕麦', unit:'100g', calories:377, protein:13.5, carbs:66.3, fat:6.7, category:'主食类', primaryNutrient:'carb' },
  { name:'全麦面包', unit:'片(40g)', calories:98, protein:4.0, carbs:18.0, fat:1.2, category:'主食类', primaryNutrient:'carb' },
  { name:'红薯', unit:'100g', calories:86, protein:1.6, carbs:20.1, fat:0.1, category:'主食类', primaryNutrient:'carb' },
  { name:'荞麦面', unit:'100g', calories:340, protein:13.3, carbs:71.5, fat:2.7, category:'主食类', primaryNutrient:'carb' },
  { name:'玉米', unit:'100g', calories:96, protein:3.3, carbs:19.0, fat:1.2, category:'主食类', primaryNutrient:'carb' },
  { name:'藜麦', unit:'100g', calories:368, protein:14.1, carbs:64.2, fat:6.1, category:'主食类', primaryNutrient:'carb' },
  { name:'赤小豆', unit:'100g', calories:324, protein:20.0, carbs:60.7, fat:0.6, category:'主食类', primaryNutrient:'carb' },
  { name:'意面', unit:'100g', calories:350, protein:12.0, carbs:72.0, fat:1.5, category:'主食类', primaryNutrient:'carb' },
  // 肉蛋类
  { name:'鸡胸肉', unit:'100g', calories:133, protein:31.0, carbs:0, fat:1.2, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'鸡蛋', unit:'1个(50g)', calories:72, protein:6.0, carbs:0.6, fat:5.0, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'牛肉', unit:'100g', calories:250, protein:26.0, carbs:0, fat:15.0, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'三文鱼', unit:'100g', calories:208, protein:20.0, carbs:0, fat:13.0, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'虾仁', unit:'100g', calories:93, protein:20.0, carbs:0.2, fat:0.6, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'瘦猪肉', unit:'100g', calories:143, protein:20.0, carbs:1.5, fat:6.2, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'金枪鱼', unit:'100g', calories:130, protein:26.0, carbs:0, fat:2.0, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'豆腐', unit:'100g', calories:81, protein:8.1, carbs:4.2, fat:3.7, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'鸭胸', unit:'100g', calories:140, protein:22.0, carbs:0, fat:5.0, category:'肉蛋类', primaryNutrient:'protein' },
  { name:'蛋白粉', unit:'勺(30g)', calories:113, protein:24.0, carbs:3.0, fat:1.0, category:'肉蛋类', primaryNutrient:'protein' },
  // 蔬菜类
  { name:'西兰花', unit:'100g', calories:34, protein:2.8, carbs:6.6, fat:0.4, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'菠菜', unit:'100g', calories:23, protein:2.9, carbs:3.6, fat:0.4, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'番茄', unit:'100g', calories:18, protein:0.9, carbs:3.9, fat:0.2, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'黄瓜', unit:'100g', calories:15, protein:0.7, carbs:3.6, fat:0.1, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'生菜', unit:'100g', calories:15, protein:1.4, carbs:2.9, fat:0.2, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'芹菜', unit:'100g', calories:14, protein:0.7, carbs:3.0, fat:0.2, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'胡萝卜', unit:'100g', calories:37, protein:1.0, carbs:8.8, fat:0.2, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'紫甘蓝', unit:'100g', calories:31, protein:1.4, carbs:6.9, fat:0.2, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'芦笋', unit:'100g', calories:20, protein:2.2, carbs:3.9, fat:0.1, category:'蔬菜类', primaryNutrient:'fiber' },
  { name:'蘑菇', unit:'100g', calories:22, protein:3.1, carbs:3.3, fat:0.3, category:'蔬菜类', primaryNutrient:'fiber' },
  // 水果类
  { name:'香蕉', unit:'1根(120g)', calories:105, protein:1.3, carbs:27.0, fat:0.4, category:'水果类', primaryNutrient:'fiber' },
  { name:'苹果', unit:'1个(200g)', calories:106, protein:0.5, carbs:28.0, fat:0.4, category:'水果类', primaryNutrient:'fiber' },
  { name:'蓝莓', unit:'100g', calories:57, protein:0.7, carbs:14.5, fat:0.3, category:'水果类', primaryNutrient:'fiber' },
  { name:'橙子', unit:'1个(150g)', calories:70, protein:1.4, carbs:17.6, fat:0.2, category:'水果类', primaryNutrient:'fiber' },
  { name:'葡萄', unit:'100g', calories:69, protein:0.7, carbs:18.0, fat:0.2, category:'水果类', primaryNutrient:'fiber' },
  { name:'猕猴桃', unit:'1个(100g)', calories:61, protein:1.1, carbs:14.7, fat:0.5, category:'水果类', primaryNutrient:'fiber' },
  { name:'火龙果', unit:'100g', calories:55, protein:1.1, carbs:13.0, fat:0.4, category:'水果类', primaryNutrient:'fiber' },
  { name:'牛油果', unit:'半个(100g)', calories:160, protein:2.0, carbs:8.5, fat:14.7, category:'水果类', primaryNutrient:'fat' },
  // 奶制品
  { name:'纯牛奶', unit:'250ml', calories:162, protein:7.5, carbs:12.0, fat:9.0, category:'奶制品', primaryNutrient:'protein' },
  { name:'希腊酸奶', unit:'100g', calories:97, protein:9.0, carbs:4.0, fat:5.0, category:'奶制品', primaryNutrient:'protein' },
  { name:'茅屋芝士', unit:'100g', calories:98, protein:11.0, carbs:3.4, fat:4.3, category:'奶制品', primaryNutrient:'protein' },
  { name:'脱脂奶', unit:'250ml', calories:86, protein:8.5, carbs:12.0, fat:0.2, category:'奶制品', primaryNutrient:'protein' },
  { name:'奶酪', unit:'片(20g)', calories:70, protein:4.0, carbs:0.5, fat:5.8, category:'奶制品', primaryNutrient:'protein' },
  { name:'豆奶', unit:'250ml', calories:107, protein:7.5, carbs:6.0, fat:6.0, category:'奶制品', primaryNutrient:'protein' },
  // 零食坚果
  { name:'杏仁', unit:'30g', calories:173, protein:6.0, carbs:6.0, fat:15.0, category:'零食坚果', primaryNutrient:'fat' },
  { name:'核桃', unit:'30g', calories:196, protein:4.5, carbs:3.9, fat:19.5, category:'零食坚果', primaryNutrient:'fat' },
  { name:'花生酱', unit:'勺(15g)', calories:94, protein:3.5, carbs:3.5, fat:8.0, category:'零食坚果', primaryNutrient:'fat' },
  { name:'黑巧克力', unit:'30g', calories:170, protein:2.0, carbs:15.0, fat:12.0, category:'零食坚果', primaryNutrient:'fat' },
  { name:'腰果', unit:'30g', calories:166, protein:4.5, carbs:9.0, fat:13.5, category:'零食坚果', primaryNutrient:'fat' },
  { name:'奇亚籽', unit:'10g', calories:49, protein:1.7, carbs:4.0, fat:3.0, category:'零食坚果', primaryNutrient:'fat' },
  { name:'燕麦棒', unit:'根(35g)', calories:140, protein:3.0, carbs:22.0, fat:4.5, category:'零食坚果', primaryNutrient:'carb' },
  { name:'全麦饼干', unit:'3片(30g)', calories:135, protein:2.5, carbs:20.0, fat:5.0, category:'零食坚果', primaryNutrient:'carb' },
  // 油脂调料
  { name:'橄榄油', unit:'勺(10ml)', calories:88, protein:0, carbs:0, fat:10.0, category:'油脂调料', primaryNutrient:'fat' },
  { name:'椰子油', unit:'勺(10ml)', calories:86, protein:0, carbs:0, fat:9.8, category:'油脂调料', primaryNutrient:'fat' },
  { name:'蜂蜜', unit:'勺(15g)', calories:49, protein:0, carbs:12.5, fat:0, category:'油脂调料', primaryNutrient:'carb' },
  { name:'枫糖浆', unit:'勺(15ml)', calories:39, protein:0, carbs:10.0, fat:0, category:'油脂调料', primaryNutrient:'carb' },
  { name:'包子', unit:'个(80g)', calories:200, protein:8.0, carbs:28.0, fat:6.0, category:'主食类', primaryNutrient:'carb' },
  { name:'豆浆', unit:'250ml', calories:35, protein:3.0, carbs:3.0, fat:1.5, category:'奶制品', primaryNutrient:'protein' },
];
